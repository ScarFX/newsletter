// index.ts
import { createSub, getSubById, getSubByEmail, updateSub, deleteSub } from "./subService";
import Mailgun from "mailgun.js";
import formData from 'form-data';
import * as dotenv from 'dotenv';
dotenv.config();
async function main() {
    //const newUser = await createSub({
        //email: "test1@test.com",
        //isConfirmed: false,
        //confirmationToken: "testToken",
        //createdAt: Date.now(),
        //confirmedAt: undefined }); 
        //let id = newUser._id;
        //console.log(`Finished with ${id}`);
//}
//const checkUser = await getSubByEmail("test@test.com");
//if (!checkUser){
    //console.log("it is null")
//}
//else{
//console.log(`It is not null`);
//return 1;
//}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY!});

mg.messages.create('mail.librechat.ai', {
    from: "Excited User <user@mail.librechat.ai>",
    to: ["cjfinn29@hotmail.com"],
    subject: "Hello IT WORKED",
    text: "Testing some Mailgun awesomness!",
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.error(err)); // logs any error
}


main().catch(console.error);
