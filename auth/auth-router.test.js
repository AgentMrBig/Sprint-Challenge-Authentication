const request = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')

const Login = '/api/auth/login'
const Register = '/api/auth/register'

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        const testUser = { username: 'testGuy', password: '1980' }
        await request(server).post(Register).send(testUser)
    });

    describe('login error', () => {
        it('should return status code 400', async () => {
            const loginErr = 'username and password are mandatory DUDE!'
            const res = await request(server).post(Login)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error', loginErr)
        });
    });

    describe('login successful', () => {
        it('should return HTTP status code 200', async () => {
            const loginSuccess = { username: 'testGuy', password: '1980' }
            const res = await request(server).post(Login).send(loginSuccess)
            expect(res.status).toBe(200)
        });
    });

});

describe('POST /api/auth/register', () => {
    beforeEach(async () => { await db('users').truncate() })

    describe('Registration error: missing arguments', () => {
        it('should return status code 400', async () => {
            const regErr = 'username and password are mandatory DUDE!'
            const res = await request(server).post(Register)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('error', regErr)
        })
    })

    describe('Registration successful', () => {
        it('should return status code 201', async () => {
            const testUser = { username: 'testGuy', password: '1980' }
            const res = await request(server).post(Register).send(testUser)
            expect(res.status).toBe(201)
        })

        it('should return newly-created user with hashed password', async () => {
            const testUser = { username: 'testGuy', password: '1980' }
            const res = await request(server).post(Register).send(testUser)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty('username', testUser.username)
            expect(res.body).toHaveProperty('password')
            expect(res.body).not.toHaveProperty('password', testUser.password)
        })
    })

});

