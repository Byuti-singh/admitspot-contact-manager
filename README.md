# admitspot-contact-manager

## Prerequisites

Below softwares should be installed in your system.
- Node.JS
- Postgres
- Postman

**Note:** This application is tested in windows system.

## Instructions to setup project locally

- Install required dependencies by running below commands

```bash
npm run dev
npm install pg bcrypt jsonwebtoken joi nodemailer csv-parser multer xlsx express-rate-limit 
```

- Run the sql DB script to create database and users and contacts tables.

- Update the `.env` file with proper credentials.

**Note:** You need to setup app password for email account from which you will send verification and reset password mails to user's mail id. Update the same app password in `.env` file for email password.

- Start development server with below command

```bash
npm run dev
```

**Note:** You can get sql script, ER Diagram and API documentation to test endpoints of application in `imp-informations` folder.

### Developed by
[Byuti Singh](https://github.com/Byuti-singh)
