"use client"

import { BasketItemWithProduct, ShoppingBasket, getBasket } from "@/db/basket";
import { currencyFormat } from "@/lib/utils";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { createOrder, paystackPay } from "./_actions/actions";
import { fetchBasket } from "@/components/Navbar/ServerComponets";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaystackButton } from "react-paystack"
import { PaystackProps } from "react-paystack/dist/types";
import { useFormStatus } from "react-dom";

const paymentMethods = [
    { id: 'PayStack', title: 'Paystack' },

]
const addOrderSchema = z.object({
  email_address: z.string().email('Please provide a valid email address'),
  name_first: z.string().min(1, 'First name must be at least 1 character').max(255, 'First name must be at most 255 characters'),
  name_last: z.string().min(1, 'Last name must be at least 1 character').max(255, 'Last name must be at most 255 characters'), 
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters').max(14, 'Phone number must be at most 14 characters'), 
  payment_type: z.string().optional(), 
  address1: z.string().min(1, 'Address must be at least 1 character').max(255, 'Address must be at most 255 characters'),
  address2: z.string().optional(),
  surburb: z.string().min(1, 'Suburb must be at least 1 character').max(255, 'Suburb must be at most 255 characters'), 
  city: z.string().min(1, 'City must be at least 1 character').max(255, 'City must be at most 255 characters'), 
  province: z.string().min(1, 'Province must be at least 1 character').max(255, 'Province must be at most 255 characters'),
  postal_code: z.string().min(1, 'Postal code must be at least 1 character').max(4, 'Postal code must be at most 4 characters'),
});

type addOrderSchemaType = z.infer<typeof addOrderSchema>

export default function CheckoutPage(){
  const [basket, setBasket] = useState<ShoppingBasket | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [componentProps, setComponentProps] = useState<PaystackProps | null>(null);
  const total = (basket?.total || 0)



  

 const {data:session} = useSession()
  const { register, handleSubmit, formState: { errors } } = useForm<addOrderSchemaType>({
    mode: 'onTouched',
    resolver:zodResolver(addOrderSchema)
  });
  
  const onSubmit = async (data:any) => {
    try {
      setSubmitting(true)
      const order = await createOrder(data, session,basket);
      const paystackResponse = await paystackPay({
        amount: total,
        email: data.email_address,
        currency: "ZAR",
        reference: order.id,
        callback_url: "http://localhost:3000/basket/checkout/success",
      });
      setSubmitting(false);
      if (paystackResponse.status === true) {
        window.location.href = paystackResponse.data.authorization_url;
      }
    } catch (error) {
      console.error('Error:', error); // Add this log
      setSubmitting(false);
    }
      
  };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const basketData = await fetchBasket();
          setBasket(basketData);
        } catch (error) {
          console.error('Error fetching basket:', error);
        }
      };
  
      fetchData();
    }, []);

    
    const getProductSize = (variantId: any,product:any) =>{
      var variant = product.variants.find((v:any) => v.id === variantId);
      if (variant) {
        return variant.size;
      } else {
        console.error('Variant not found for ID:', variantId);
        return 'N/A';
      }
    }
    

    return(
        <div className="mt-[80px]">

           <div className="bg-white lg:bg-transparent">
      {/* Background color split screen for large screens */}
      <div className="hidden lg:block fixed top-0 left-0 w-1/2 h-full bg-white" aria-hidden="true" />
      <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-black" aria-hidden="true" />

      <div className="relative grid grid-cols-1 gap-x-16 max-w-7xl mx-auto lg:px-8 lg:grid-cols-2 lg:pt-16">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-red-950 text-indigo-300 py-12 md:px-10 lg:max-w-lg lg:w-full lg:mx-auto lg:px-0 lg:pt-0 lg:pb-24 lg:bg-transparent lg:row-start-1 lg:col-start-2"
        >
          <div className="max-w-2xl mx-auto px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <div className="text-sm font-medium text-white">Amount due</div>
              <div className="mt-1 text-3xl font-extrabold text-white">{currencyFormat(basket?.total || 0)}</div>
            </div>

            <ul role="list" className="text-sm font-medium divide-y divide-white divide-opacity-10">
              {basket?.items.map((basketItem:BasketItemWithProduct) =>(
                <li key={basketItem.product.id} className="flex items-start py-6 space-x-4">
                  <img
                    src={basketItem.product.pictureUrl}
                    className="flex-none w-20 h-20 rounded-md object-center object-cover"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-white">{basketItem.product.name}</h3>
                    <h3 className="text-neutral-200">{getProductSize(basketItem.productVariantId,basketItem.product)}</h3>
                    <input className="h-8 w-10 bg-neutral-700 text-white text-center text-base outline-none" type="number" value={basketItem.quantity} readOnly/>
                  </div>
                  <p className="flex-none text-base font-medium text-white">{currencyFormat(basketItem.product.price)}</p>
                </li>
              ))}
            </ul>

            <dl className="text-sm font-medium space-y-6 border-t border-white border-opacity-10 pt-6 text-neutral-200">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{currencyFormat(basket?.subtotal || 0)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>VAT(15%)</dt>
                <dd>{currencyFormat(basket?.vat || 0)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Delivery Fee</dt>
                <dd>{currencyFormat(basket?.deliveryFee || 0)}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-white border-opacity-10 text-white pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">{currencyFormat(basket?.total || 0)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:max-w-lg lg:w-full lg:mx-auto lg:pt-0 lg:pb-24 lg:row-start-1 lg:col-start-1"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Payment and shipping details
          </h2>
          
          <form id="paymentForm" className="text-black" onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-2xl mx-auto px-4 lg:max-w-none lg:px-0">
              <div>
                <h3 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                  Contact information
                </h3>
                

                <div className="mt-6">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 ">
                    <Input
                      type="email"
                      id="email-address"
                      autoComplete="email" 
                      {...register("email_address")}
                      required
                      className="block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                     {errors.email_address && <span className="text-destructive">{errors.email_address.message}</span>}
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="name_first" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1 ">
                    <Input
                      type="text"
                      id="name_first"
                      {...register("name_first")}
                      autoComplete="first-name" required
                      className="block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.name_first && <span className="text-destructive">{errors.name_first.message}</span>}
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="name_last" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1 ">
                    <Input
                      type="text"
                      id="name_last"
                      {...register("name_last")}
                      autoComplete="name_last"
                      className="block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.name_last && <span className="text-destructive">{errors.name_last.message}</span>}
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 ">
                    <Input
                      type="text"
                      id="phone_number"
                      {...register("phone_number")}
                      autoComplete="phone_number"
                      className="block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.phone_number && <span className="text-destructive">{errors.phone_number.message}</span>}
                  </div>
                  {<p className="text-black text-sm">Exmaple: 0823456789</p>}
                </div>
                
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                <fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                    <div key={paymentMethod.id} className="flex items-center">
                      {paymentMethodIdx === 0 ? (
                        <input
                          id={paymentMethod.id}
                          name="payment-type"
                          type="radio"
                          defaultChecked
                          className="focus:ring-black h-4 w-4 text-black border-gray-300"
                        />
                      ) : (
                        <input
                          id={paymentMethod.id}
                          name="payment-type"
                          type="radio"
                          className="focus:ring-black h-4 w-4 text-black border-gray-300"
                        />
                      )}

                      <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              
                
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Shipping address</h3>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="address1"
                        {...register("address1")}
                        autoComplete="street-address"
                        className="block h-10 w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                      {errors.address1 && <span className="text-destructive">{errors.address1.message}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                      Address 2(Optional)
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="address2"
                        {...register("address2")}
                        autoComplete="street-address"
                        className="block h-10 w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                      {errors.address2 && <span className="text-destructive">{errors.address2.message}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="surburb" className="block text-sm font-medium text-gray-700">
                      Surburb
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="surburb"
                        {...register("surburb")}
                        autoComplete="street-address"
                        className="block h-10 w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                      {errors.surburb && <span className="text-destructive">{errors.surburb.message}</span>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="city"
                        {...register("city")}
                        autoComplete="address-level2"
                        className="block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                      {errors.city && <span className="text-destructive">{errors.city.message}</span>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <div className="mt-1">
                    <select
                    id="province"
                    {...register("province")}
                    autoComplete="address-level1"
                    className="block h-10 w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    >
                    <option value="Gauteng">Gauteng</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="North West">North West</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="Western Cape">Western Cape</option>
                    </select>

                    </div>
                    {errors.province && <span className="text-destructive">{errors.province.message}</span>}
                  </div>

                  <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      Postal code
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="postal-code"
                        {...register("postal_code")}
                        autoComplete="postal-code"
                        className="block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                      {errors.postal_code && <span className="text-destructive">{errors.postal_code.message}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        id="acountry"
                        name="country"
                        defaultValue="South Africa"
                        readOnly

                        autoComplete="country"
                        className="block h-10 w-full border bg-neutral-300 border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Billing information</h3>

                <div className="mt-6 flex items-center">
                  <Input
                    id="same-as-shipping"
                    name="same-as-shipping"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                    style={{ color: "black !important" }}
                  />
                  <div className="ml-2">
                    <label htmlFor="same-as-shipping" className="text-sm font-medium text-gray-900">
                      Same as shipping information
                    </label>
                  </div>
                </div>
              </div> */}

              <div className="mt-10 flex justify-end pt-6 border-t border-gray-200">
              <button id='paymentButton'
                  type="submit"
                  disabled={submitting}
                  className="bg-black border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                  {submitting ? "Please wait ..." :"Pay Now"}
                    </button>
              
              </div>
            </div>
          </form>
          {componentProps && (
        <div className="mt-4">
          <PaystackButton {...componentProps} />
        </div>
      )}
        </section>
      </div>
    </div>
        </div>
    )
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return(
    <button
    type="submit"
    disabled={pending}
    className="bg-black border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
    >
     {pending ? "Loading..." : "Pay Now"}
      </button>
  )
 
}