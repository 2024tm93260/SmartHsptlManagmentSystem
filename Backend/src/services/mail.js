const sendMail = async ({ to, subject, html }) => {
  console.log("Email sending is disabled", {
    to,
    subject,
    htmlLength: html?.length || 0,
  });

  return {
    skipped: true,
    to,
    subject,
  };
};

export default sendMail;
