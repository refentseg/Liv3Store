"use server"
import db from "@/db/db"
import {z} from "zod"
import { notFound, redirect} from "next/navigation"
import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"
const cloudinary = require('cloudinary').v2

const fileSchema = z.instanceof(File,{message:"Required"})

const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"));

const addSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  department: z.string().min(1).max(255),
  type: z.string().min(1).max(255),
  priceInCents: z.coerce.number().min(100),
  image: imageSchema.refine(file => file.size >0,"Required"),
})
const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1),
  color: z.string().min(1),
  quantityInStock: z.number().int().min(0, "Quantity must be a non-negative integer"),
});


const variantsArraySchema = z.array(variantSchema)

type VariantData = z.infer<typeof variantSchema>;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//Manage Variants
export async function manageVariants(id:string,prevState:unknown,formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
      redirect('/auth/login');
  }
  if (session.user.role !== Role.ADMIN) {
    const response = NextResponse.redirect(new URL('/auth/login'));
    response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
    return response;
  }
  const variantsData: VariantData[] = [];
  for (let [key, value] of formData.entries()) {
    const match = key.match(/variants\[(\d+)\]\.(\w+)/);
    if (match) {
      const [, indexStr, field] = match;
      const index = parseInt(indexStr, 10);
      
      if (!variantsData[index]) {
        variantsData[index] = { size: '', color: '', quantityInStock: 0 };
      }

      if (field === 'id' || field === 'size' || field === 'color') {
        variantsData[index][field] = value as string;
      } else if (field === 'quantityInStock') {
        variantsData[index][field] = parseInt(value as string, 10);
      }
    }
  }

  const result = variantsArraySchema.safeParse(variantsData)

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  console.log('Validated data:', data);
  
  try {
    const existingVariants = await db.productVariant.findMany({
      where: { productId: id},
      select: { id: true }
    });
    const existingVariantIds = new Set(existingVariants.map(v => v.id));
    const operations = data.map(variant => {
      if (variant.id) {
        existingVariantIds.delete(variant.id);
        return db.productVariant.update({
          where: { id: variant.id },
          data: {
            size: variant.size,
            color: variant.color,
            quantityInStock: variant.quantityInStock,
          }
        });
      } else {
        return db.productVariant.create({
          data: {
            productId: id,
            size: variant.size,
            color: variant.color,
            quantityInStock: variant.quantityInStock,
          }
        });
      }
    });

    // Add delete operations for variants not present in the form data
    existingVariantIds.forEach(id => {
      operations.push(db.productVariant.delete({ where: { id } }));
    });

    // Execute all operations
    await Promise.all(operations);
    
  } catch (error) {
    console.error('Failed to manage product variants:', error);
    return { error: true, message: 'Failed to manage product variants' };
  }

  redirect('/admin/products')
  
}

//Uploading images to Cloudinary
async function uploadImage(file:File): Promise<string> {
    try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        public_id: `${crypto.randomUUID()}-${file.name.split('.')[0]}`,
        folder: 'Liv3Store/products',
        format: file.name.split('.')[1],
      }, (error:any, result:any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}
//Deleting images from Cloudinary
async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error removing image from Cloudinary:', error);
    throw error;
  }
}

//Products

export async function addProduct(prevState:unknown,formData: FormData){
    const session = await auth();
    if (!session || !session.user) {
        redirect('/auth/login');
    }
    if (session.user.role !== Role.ADMIN) {
      const response = NextResponse.redirect(new URL('/auth/login'));
      response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
      return response;
    }
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if(result.success === false){
        return result.error.formErrors.fieldErrors
    }
    const data = result.data

    try{
      const pictureUrl = await uploadImage(data.image);
        const createdProduct =await db.product.create({
            data:{
                name: data.name,
                description:data.description,
                department:data.department,
                type:data.type,
                price:data.priceInCents,
                pictureUrl,
            }
        });

        console.log('Product:', createdProduct)
        
    }
    catch(error){
        console.error('Error creating product with variants:', error);
    }

    redirect('/admin/products/')
}

const editSchema = addSchema.extend({
        image:imageSchema.optional()
})



export async function updateProduct(id:string,prevState:unknown,formData: FormData ){
  const session = await auth();
  if (!session || !session.user) {
      redirect('/auth/login');
  }
  if (session.user.role !== Role.ADMIN) {
    const response = NextResponse.redirect(new URL('/auth/login'));
    response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
    return response;
  }
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    if(result.success === false){
        return result.error.formErrors.fieldErrors
    }

    const data = result.data
    const product = await db.product.findUnique({where:{id}})
    if(product == null) return notFound()

    let pictureUrl = product.pictureUrl
    //Checking for new image
    if(data.image!= null && data.image.size > 0){
      //Deletes old image
      if (pictureUrl) {
        const publicId = pictureUrl.split('/').pop()?.split('-')[0] || '';
        await deleteImage(`Liv3Store/products/${publicId}`);
      }
      //Uploads new image
      pictureUrl = await uploadImage(data.image);
    }

    const updatedProduct = await db.product.update({
        where:{id},
        data:{
            name: data.name,
            description:data.description,
            department:data.department,
            type:data.type,
            price:data.priceInCents,
            pictureUrl
        }
    });
    console.log("Product updated:", updatedProduct);
    redirect('/admin/products')
}


export async function deleteProduct(id:string){
  const session = await auth();
  if (!session || !session.user) {
      redirect('/auth/login');
  }
  if (session.user.role !== Role.ADMIN) {
    const response = NextResponse.redirect(new URL('/auth/login'));
    response.cookies.set('toastMessage', 'Not authorized to use page', { path: '/' ,httpOnly: false });
    return response;
  }
    const product =await db.product.delete({where:{id}})
    if(product == null) return notFound()

    const publicId = product.pictureUrl.split('/').pop()?.split('-')[0] || '';

    await deleteImage(publicId)
    window.location.reload();
}