import React, { useState } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';

const LOGIN_USER = gql`
    query login(
        $username:String!
        $password:String!
    ){
        login(
        username:$username
        password:$password
        ){
            username
            email
            createdAt
            token
        }
    }
`

export default function Login() {
    const [variables, setVariables] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const [loginUser, { loading, data }] = useLazyQuery(LOGIN_USER, {
        onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted(data) {
            console.log(data)
            localStorage.setItem('token', data.login.token);
            window.location.href = '/';
        }
    });

    const submitLoginForm = e => {
        e.preventDefault();
        loginUser({ variables });
    }

    return (
        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
                <h1 className="text-center">Login</h1>
                <Form onSubmit={submitLoginForm}>
                    <br />
                    <Form.Group>
                        <Form.Label className={errors.username && 'text-danger'}>
                            {errors.username ?? 'Username'}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={variables.username}
                            className={errors.username && 'is-invalid'}
                            onChange={(e) => {
                                setVariables({ ...variables, username: e.target.value });
                            }}
                        />
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label className={errors.password && 'text-danger'}>
                            {errors.password ?? 'Password'}
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={variables.password}
                            className={errors.password && 'is-invalid'}
                            onChange={(e) => {
                                setVariables({ ...variables, password: e.target.value });
                            }}
                        />
                    </Form.Group>
                    <br />
                    <div className="text-center">
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? 'Loading..' : 'Login'}
                        </Button>
                        <br />
                        <small>Don't have an account? <Link to="/register">Register</Link></small>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}