import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
  url:string;
}

export const WelcomeEmail = ({userFirstname,url}: EmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}> &gt; Hi {userFirstname},</Text>
        <Text style={paragraph}>
        &gt; Welcome to Liv3 Online. You’ve just entered a world where fashion meets the future. Before you can fully immerse yourself in this experience, we need to verify your email address.
        </Text>
        <Text style={paragraph}>
        &gt; Token only valid for an hour
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={url}>
            Verify Email address
          </Button>
        </Section>
        <Text style={paragraph}>
        Best,
          <br />
         The Liv3 online team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          South Africa
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  userFirstname: "Ron",
} as EmailProps;

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "black",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  cursor:"pointer",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
