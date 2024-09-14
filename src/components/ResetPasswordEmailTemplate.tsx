import * as React from 'react';

interface EmailTemplateProps {
  link: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  link,
}) => (
  <div>
    <h1>Hello!</h1>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    <a href={link}>Reset Password</a>
    <br />
    <p>Regards,</p>
    <p>mrEseosa_</p>
    <hr/>
    <br/>
    <p>
      if you&apos;re having trouble clicking the &quot;Reset Password&quot; button, copy and paste the URL below into your web browser: <a href={link}>{link}</a>
    </p>
  </div>
);