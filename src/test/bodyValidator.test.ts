import {Request, Response, NextFunction} from 'express'
import sinon from 'sinon'
import {expect} from "chai";
import bodyValidator from "../middlewares/bodyValidator.js";

describe('bodyValidator', () => {
        let res: { status: any; send: any; },
        next: sinon.SinonSpy<any[], any>;

    beforeEach(()=> {
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };
        next = sinon.spy();
    });

    it('should respond with 400 for bad request', async ()=> {
        let req = {
            body: {"name": 123},
            route: {path: "/signup"}
        };
        await bodyValidator(
            (req as unknown as Request),
            (res as unknown as Response),
            (next as unknown as NextFunction)
        );

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should respond  "Missing required fields"', async ()=> {
        let req = {
            body: {"name": "Esteban"},
            route: {path: "/signup"}
        };
        let response = await bodyValidator(
            (req as unknown as Request),
            (res as unknown as Response),
            (next as unknown as NextFunction)
        );
        console.log(response)
        expect(next.called).to.be.false;
    });
});