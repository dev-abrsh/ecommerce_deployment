export const resetPasswordTemplate = (url: string, token: string) => {
  const verificationLink = `${url}?token=${encodeURIComponent(token)}`;

  return `<mjml>
  <mj-body>
    <mj-section background-color="#ffffff" padding="5px" border-radius="2px">
      <!-- Reset Password Message -->
      <mj-column>
        <mj-text font-size="18px" font-weight="bold" color="#333">
          Reset Your Password
        </mj-text>
        <mj-text font-size="16px" color="#555">
          Click the button below to reset your password.
        </mj-text>
      <!-- Reset Password Button -->
 
        <mj-button href="${verificationLink}" background-color="#309eab" color="#ffffff" border-radius="5px" font-size="16px">
          Reset Password
        </mj-button>
        <mj-text align="center" font-size="12px" color="#888888">
          If you didn't request this, ignore this email.
        </mj-text>
      </mj-column>

    </mj-section>
  </mj-body>
</mjml>`;
};
