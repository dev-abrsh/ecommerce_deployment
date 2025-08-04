export const emailVerificationTemplate = (
  otp: string,
) => {
  return `
  <mjml>
  <mj-head>
    <mj-title>Techify OTP Email</mj-title>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text line-height="2" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#ffffff">
    <mj-section padding="50px 0">
      <mj-column width="70%">
        <!-- Header / Logo -->
        <mj-text font-size="22px" font-weight="600" color="#00466a" padding-bottom="10px" border-bottom="1px solid #eee">
          <a href="#" style="color: #00466a; text-decoration: none;">Techify</a>
        </mj-text>

        <!-- Greeting -->
        <mj-text font-size="18px" padding-top="20px">
          Hi,
        </mj-text>

        <!-- Message -->
        <mj-text font-size="16px">
          Thank you for choosing Techify. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes.
        </mj-text>

        <!-- OTP Code -->
        <mj-text background-color="#00466a" color="#ff0ffff" font-size="24px" font-weight="bold" align="center" border-radius="4px" padding="10px 25px" width="max-content">
          ${otp}
        </mj-text>

        <!-- Signature -->
        <mj-text font-size="14px" padding-top="20px">
          Regards,<br />
          Techify Team
        </mj-text>

        <!-- Divider -->
        <mj-divider border-color="#eee" />

        <!-- Footer -->
        <mj-text align="right" font-size="13px" color="#aaa" line-height="1.5" font-weight="300">
          Techify Inc<br />
          1600 Amphitheatre Parkway<br />
          California
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>

  `;
};
