import {expect} from "chai";
import getBodyValidatorByRoutePath from "../helpers/getBodyValidatorByRoutePath.js";

describe('getBodyValidatorByRoutePath', () => {
    it('should replace "/" & "-" chars', async ()=> {
        expect(getBodyValidatorByRoutePath('/signup')).to.be.deep.equal('SignupBody.js');
        expect(getBodyValidatorByRoutePath('/job-positions')).to.be.deep.equal('JobPositionsBody.js');
    });
});