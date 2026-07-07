export async function sendMail({ to, subject, html }) { console.log(`[mail] ${subject} -> ${to}\n${html}`); }
