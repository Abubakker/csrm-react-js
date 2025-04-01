import splitAmount from './splitAmount';

describe('splitAmount function', () => {
  test('splits amount correctly', () => {
    const result = splitAmount(100, 5, 20);
    expect(result).toEqual([20, 20, 20, 20, 20]);

    const result2 = splitAmount(858000, 4, 358000);
    expect(result2).toEqual([358000, 166666, 166666, 166668]);

    const result3 = splitAmount(400, 4, 200);
    expect(result3).toEqual([200, 66, 66, 68]);

    const result4 = splitAmount(400, 3, 200);
    expect(result4).toEqual([200, 100, 100]);

    const result5 = splitAmount(401, 2, 203);
    expect(result5).toEqual([203, 198]);
  });

  test('handles invalid parameters', () => {
    expect(() => {
      splitAmount(-100, 5, 20);
    }).toThrowError();
  });
});
