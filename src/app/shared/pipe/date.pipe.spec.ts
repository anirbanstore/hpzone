import { HPDatePipe } from './date.pipe';

describe('HPDatePipe tests', () => {

  let pipe: HPDatePipe;

  beforeEach(() => pipe = new HPDatePipe());

  it('should return falsy for null input', () => {
    expect(pipe.transform(null)).toBeFalsy();
  });

  it('should return falsy for undefined input', () => {
    const dateNum: number = undefined;
    expect(pipe.transform(dateNum)).toBeFalsy();
  });

  it('should return correct date', () => {
    const date = new Date('1/1/980');
    const dateNum = date.getTime();
    expect(pipe.transform(dateNum)).toEqual(date);
  });

});
