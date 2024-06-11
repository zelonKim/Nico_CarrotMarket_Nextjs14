"use server";

export async function handleForm(prevState: any, formData: FormData) { // also, server action function can have a previous state
    console.log(prevState);
      // first login -> { potato: 1 }
      // second login -> { errors: [ 'wrong password', 'password is too short' ] }
      // third login -> { errors: [ 'wrong password', 'password is too short' ] 
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      errors: ["wrong password", "password is too short"]
    }
}