# FAST CREDIT

Fast Credit is an online lending platform that offers individuals short-term soft loans. This contributes to the resolution of financial inclusion issues as a means of alleviating poverty and empowering low-income earners.

## Required Features

- User (client) can **sign up**
- User (client) can **login**
- User (client) can **request for only one loan at a time**
- User (client) can **view loan repayment history, to keep track of his/her liability or responsibilities**
- User (client) can **update profile to meetup requirement after profile rejection**
- Admin can **mark a client as verified , after confirming his/her home and work address**
- Admin can **view a specific loan application**
- Admin can **approve or reject a client’s loan application**
- Admin can **post loan repayment transaction in favour of a client**
- Admin can **view all loan applications**
- Admin can **view all current loans (not fully repaid)**
- Admin can **view all repaid loans**

## Optional Features

- User can **reset password**
- **Real time email notification upon approval or rejection of a loan request**

## Technologies

- Node JS
- Express
- Mocha & Chai
- Joi
- ESLint
- Babel
- Postgres

## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
  To run:

```sh
git clone <https://github.com/tobslob/fastcredit.git>
cd fastcredit
npm install
npm start
```

## Testing

```sh
npm test
```

## API-ENDPOINTS

- V1

`- POST /api/v1/auth/signup Create user account`

`- POST /api/v1/auth/signin Login a user`

`- GET /api/v1/user Get all user`

`- GET /api/v1/user/<:id> Get a user`

`- PATCH /api/v1/user/<:id> Update a user`

`- DELETE /api/v1/user/<:id> Delete a user`

`- POST /api/v1/loans Create a loan application`

`- GET /api/v1/loans/history View loan loan history`

`- GET /api/v1/loans/<:loan-id>/repayment View loan repayment history`

`- GET /api/v1/loans Get all loan applications`

`- GET /api/v1/loans?status=approved&repaid=false Get all current loans that are not fully repaid`

`- GET /api/v1/loans?status=approved&repaid=true Get all repaid loans.`

`- PATCH /api/v1/users/<:user-email>/verify Mark a user as verified`

`- GET /api/v1/loans/<:loan-id> Get a specific loan application`

`- PATCH /api/v1/loans/<:loan-id> Approve or reject a loan application`

`- POST /api/v1/loans/<:loan-id>/repayment Create a loan repayment record`

## Author

Calvin Job Puram
