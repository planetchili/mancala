import {Test} from "../../Test";

describe("Test",() =>
{
    let t : Test;
  
    beforeEach(() =>
    {
      t = new Test("pubes");
    });
  
    it("should do the thing right",() =>
    {
      expect(t.Trial()).toEqual("pubes@");
    }); 
});
  