// import mongoose from 'mongoose';
// import request from 'supertest';

// import { server } from '../src';

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   server.close();
// });

// describe('app', () => {
//   /**
//    * Testing GET V1 api healthz endpoint
//    */
//   describe('GET /api/v1', () => {
//     describe('given the endpoint exist', () => {
//       it('should return a 200 status with with a json message', done => {
//         request(server).get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /json/).expect(
//           200,
//           {
//             success: true,
//             message: 'Welcome to Rest API - 👋🌎🌍🌏',
//             data: null,
//           },
//           done
//         );
//       });
//     });
//   });

//   /**
//    * Testing GET healthz endpoint
//    */
//   describe('GET /api/v1/healthz', () => {
//     describe('given the endpoint exist', () => {
//       it('should return a 200 status with with a json message', done => {
//         request(server).get('/api/v1/healthz').set('Accept', 'application/json').expect('Content-Type', /json/).expect(
//           200,
//           {
//             success: true,
//             message: 'Welcome to Rest API - 👋🌎🌍🌏',
//             data: null,
//           },
//           done
//         );
//       });
//     });
//   });

//   /**
//    * Testing GET not found endpoints
//    */
//   describe('GET /not-found-endpoint', () => {
//     describe('given the endpoint does not exist', () => {
//       it('should return a 404 status with not found message', async () =>
//         request(server)
//           .get(`/not-found-endpoint`)
//           .set('Accept', 'application/json')
//           .expect('Content-Type', /json/)
//           .then(response => {
//             expect(response.body).toMatchObject({
//               data: null,
//               error: true,
//               status: 'fail',
//               message: 'Not found - /not-found-endpoint',
//             });
//           }));
//     });
//   });
// });
