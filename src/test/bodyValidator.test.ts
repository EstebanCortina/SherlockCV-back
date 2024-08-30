import {Request, Response, NextFunction} from 'express'
import sinon from 'sinon'
import {expect} from "chai";
import bodyValidator from "../middlewares/bodyValidator.js";
import getBodyValidatorByRoutePath from "../helpers/getBodyValidatorByRoutePath.js";

describe('bodyValidator', () => {
    let res: { status: any; send: any; },
        next: sinon.SinonSpy<any[], any>;

    let req = {
        body: {
            "field_string": "string",
            "field_number": 10,
            "field_object": []
        },
        bodyValidatorError: {"error": "", "info": {}},
        path: "/unit/test/:id/split-word"
    };

    beforeEach(()=> {
        let validatorPath = getBodyValidatorByRoutePath(req.path);
        if (!(validatorPath === 'UnitTestIdSplitWordBody.js')){
            throw new Error('Error getting body validator path');
        }
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        next = sinon.spy();
    });

    it('should respond with 400 for bad request', async ()=> {
        req.body = {
            "field_string": "string",
            // @ts-ignore
            "field_number": "10",
            "field_object": []
        }
        await (bodyValidator())(
            (req as unknown as Request),
            (res as unknown as Response),
            (next as unknown as NextFunction)
        );

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should respond  "Missing required fields in body"', async ()=> {

        // @ts-ignore
        req.body = {
            "field_string": "abc",
            // "field_number": "10",
            "field_object": []
        }

        await (bodyValidator())(
            (req as unknown as Request),
            (res as unknown as Response),
            (next as unknown as NextFunction)
        );
        expect(next.called).to.be.false;
        expect(req.bodyValidatorError.error).to.be.equal("Missing required fields in body")
        expect(req.bodyValidatorError.info).to.be.deep.equal({ field_number: 'number' })
    });

    it('should find the validator for a path with params', async ()=> {
        //@ts-ignore
        req.body = {
                "field_string": "string",
                "field_number": 10,
                "field_object": []
            }
        await (bodyValidator())(
            (req as unknown as Request),
            (res as unknown as Response),
            (next as unknown as NextFunction)
        );
        expect(next.called).to.be.true;
    });

    it('should validate the req.body.data variation for formData format', async ()=> {
        // The information comes in req.body.data
        //@ts-ignore
        req.body.data = JSON.stringify({
                "field_string": "string",
                "field_number": 10,
                "field_object": []
        });
        await (bodyValidator())(
            (req as unknown as Request),
            (res as unknown as Response),
            (next as unknown as NextFunction)
        );
        expect(next.called).to.be.true;
    });

});