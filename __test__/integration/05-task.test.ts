
import request from 'supertest';
import { client as app } from '../../src';
import { task, user } from '../data';
import { cloudinaryDeleteImage } from '../../src/helpers';

let userToken: string;
let category: any;

// create user before all tests
beforeAll(async () => {
    const response1 = await request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password });
    userToken = response1.body.accessToken
    category = await request(app).get('/api/v1/categories').then(res => res.body.data[0]);

    task.categoryId = category._id;
});



describe('Task', () => {
    it('should create a task', async () => {
        const res = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${userToken}`)
            .send(task);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ message: 'Task created successfully' });
    });

    it('should get all tasks', async () => {
        const res = await request(app)
            .get('/api/v1/tasks')
            .set('Authorization', `Bearer ${userToken}`);
        // to contanin at least one task
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should get a task by id', async () => {
        const tasks = await request(app)
            .get('/api/v1/tasks')

        const res = await request(app)
            .get(`/api/v1/tasks/${tasks.body.data[0]._id}`)

        expect(res.status).toBe(200);
        expect(res.body.data).toBeInstanceOf(Object);
    });

    it('should update a task', async () => {
        const res1 = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${userToken}`)
            .send(task);

        const res2 = await request(app)
            .patch(`/api/v1/tasks/${res1.body.data._id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ title: 'new title' });

        expect(res2.status).toBe(200);
    });


    it('should upload a task images', async () => {

        const res1 = await request(app).get('/api/v1/tasks').then(res => res.body.data[0]);

        const res2 = await request(app)
            .patch(`/api/v1/tasks/${res1._id}/images`)
            .set('Authorization', `Bearer ${userToken}`)
            .attach('image', '__test__/testFiles/taskImages/images (0).jpeg')
            .attach('image', '__test__/testFiles/taskImages/images (1).jpeg')
            .attach('image', '__test__/testFiles/taskImages/images (2).jpeg')
            .attach('image', '__test__/testFiles/taskImages/images (3).jpeg')
            .attach('image', '__test__/testFiles/taskImages/images (4).jpeg')

        const res3 = await Promise.all(res2.body.data.images.map((image: any) => cloudinaryDeleteImage(image.publicId)));

        expect(res2.status).toBe(200)
        expect(res2.body.data.images.length).toBe(5)
        expect(res3[0].result).toBe('ok')
    })


    // it('should delete a task', async () => {
    //     const task = await request(app)
    //         .get('/api/v1/tasks')

    //     const res = await request(app)
    //         .delete(`/api/v1/tasks/${task.body.data._id}`)
    //         .set('Authorization', `Bearer ${userToken}`);
    //     expect(res.status).toBe(204);
    // });

})
