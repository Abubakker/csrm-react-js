import checkOldProductSn from './check-old-product-sn';

describe('checkOldProductSn', () => {
  test('productSn empty should return true', () => {
    expect(
      checkOldProductSn({
        oldProductSn: '',
        currency: 'SGD',
      })
    ).toBe(true);
  });

  test('productSn is not number', () => {
    expect(
      checkOldProductSn({
        oldProductSn: '11x111yysts',
        currency: 'SGD',
      })
    ).toBe(false);
  });

  test('case should fail', () => {
    expect(
      checkOldProductSn({
        oldProductSn: '2827733',
        currency: 'SGD',
      })
    ).toBe(false);

    expect(
      checkOldProductSn({
        oldProductSn: '10292929',
        currency: 'JPY',
      })
    ).toBe(false);

    expect(
      checkOldProductSn({
        oldProductSn: '310292929',
        currency: 'SGD',
      })
    ).toBe(false);

    expect(
      checkOldProductSn({
        oldProductSn: '10288228',
        currency: 'SGD',
      })
    ).toBe(false);
  });

  test('case should pass', () => {
    expect(
      checkOldProductSn({
        oldProductSn: '10104781',
        currency: 'HKD',
      })
    ).toBe(true);

    expect(
      checkOldProductSn({
        oldProductSn: '30015876',
        currency: 'SGD',
      })
    ).toBe(true);

    expect(
      checkOldProductSn({
        oldProductSn: '307451',
        currency: 'JPY',
      })
    ).toBe(true);

    expect(
      checkOldProductSn({
        oldProductSn: '271011',
        currency: 'JPY',
      })
    ).toBe(true);
  });
});
