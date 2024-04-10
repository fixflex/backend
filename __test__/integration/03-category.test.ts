import request from 'supertest';
import { client as app } from '../../src';
import { cloudinaryDeleteImage } from '../../src/helpers';
import { admin, category } from '../data'
import UserModel from '../../src/DB/models/user.model';
import { createAccessToken } from '../../src/helpers';

let token: string;

beforeAll(async () => {
    const user = await UserModel.create(admin);
    token = createAccessToken(user._id);
})

describe('Category', () => {
    it('should create a new category', async () => {
        let response = await request(app)
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send(category);

        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
    });

    it('should return 400 if no name provided', async () => {
        let response = await request(app)
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({});
        expect(response.status).toBe(400);
    });

    it('should return 400 if name is not an object', async () => {
        let response = await request(app)
            .post('/api/v1/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'plumbing' });
        expect(response.status).toBe(400);
    });

    it('should retrieve all categories', async () => {
        let response = await request(app)
            .get('/api/v1/categories')

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    });

    it('should retrieve a category by id', async () => {
        let response = await request(app)
            .get('/api/v1/categories')
        let categoryId = response.body.data[0]._id;

        response = await request(app)
            .get(`/api/v1/categories/${categoryId}`)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    });

    it('should return 404 if category not found', async () => {
        let response = await request(app)
            .get('/api/v1/categories/6611ac3aad7fa3fdb8d3f711')
        expect(response.status).toBe(404);
    });

    it('should update a category', async () => {
        let response = await request(app)
            .get('/api/v1/categories')
        let categoryId = response.body.data[0]._id;

        response = await request(app)
            .patch(`/api/v1/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: { en: 'plumbing', ar: 'السباكة' } });
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    });
    //    this.router.route(`${this.path}/category-image/:id`).patch(isMongoId, uploadServiceImage, this.categoryController.uploadCategoryImage);
    it('should update a category image', async () => {
        let response = await request(app)
            .get('/api/v1/categories')
        let categoryId = response.body.data[0]._id;

        response = await request(app)
            .patch(`/api/v1/categories/category-image/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .attach('image', '__test__/testFiles/category.png');
        const response2 = await cloudinaryDeleteImage(response.body.data.image.publicId);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.image.url).toMatch('https://res.cloudinary.com');
        expect(response.body.data.image.publicId).toBeDefined();
        expect(response2.result).toBe('ok');
    })


    // it('should delete a category', async () => {
    //     let response = await request(app)
    //         .get('/api/v1/categories')
    //     let categoryId = response.body.data[0]._id;

    //     response = await request(app)
    //         .delete(`/api/v1/categories/${categoryId}`)
    //         .set('Authorization', `Bearer ${token}`)
    //     expect(response.status).toBe(204);
    // });
});

export { }; 
