// 先改目录下Print_打印页面.html的文件，调整好后再同步过来。
/**
 * 注意事项
 * 1、这个位置以下替换
 * 2、记得更改 .PriceTag 中的 border: 0px solid #eee !important;
 */
export const PrintInnerHTML = (data: string) => `
<!Doctype html>
<html>
<head>
    <title>Preview Content</title>
    <style>
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: auto;
        background-color: #f1f2f3;
        box-sizing: border-box;
    }

    .print {
        width: 594.3pt;
        height: 840.51pt;
        background-color: #fff;
        position: relative;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px auto;
    }

    .print #printWarp {
        width: 531.84pt;
        height: 625.44pt;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
    }

    // 1、这个位置以下替换
    // 2、记得更改 .PriceTag 中的 border: 0px solid #eee !important;

   
    .font-Hiragino {
        font-family: Hiragino Mincho ProN;
    }

    .font-Georgia {
        font-family: Georgia;
    }

    .container {
        width: 88.64pt;
        height: 208.48pt;
        display: inline-block;
        box-sizing: border-box;
    }

    .PriceTag {
        width: 88.64pt;
        height: 208.48pt;
        background-color: #fff;
        padding: 24px 4px 12px 4px;
        display: inline-block;
        position: relative;
        border: 0px solid #eee !important;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .PriceTag .Hermes {
        font-family: Georgia;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 0em;
        text-align: center;
        color: #000;
        margin-bottom: 4px;
        text-transform: uppercase;
        zoom: 0.5;
        box-sizing: border-box;
    }

    .PriceTag .title {
        max-height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    .PriceTag .title .title_text {
        font-size: 23px;
        font-weight: 700;
        line-height: 25px;
        letter-spacing: 0em;
        color: #000;
        overflow: hidden;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-align: center;
        zoom: 0.5;
        box-sizing: border-box;
    }


    .PriceTag .subtitle {
        font-family: Hiragino Mincho ProN;
        font-size: 15px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: center;
        margin: 16px 0px;
        zoom: 0.5;
        box-sizing: border-box;
    }

    .PriceTag .info {
        margin: 0px 4%;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
    }

    .PriceTag .info .infoWarp {
        display: inline-flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    .PriceTag .info .infoWarp .items {
        margin-bottom: 8px;
        width: 100%;
        zoom: 0.5;
        font-size: 14px;
        line-height: 18px;
        font-weight: 200;
        letter-spacing: 0em;
        display: inline-flex;
        flex-direction: row;
        overflow: hidden;
        box-sizing: border-box;
    }

    .PriceTag .info .infoWarp .items .label {
        color: #91641a;
        font-family: Hiragino Mincho ProN;
        box-sizing: border-box;
    }

    .PriceTag .info .infoWarp .items .label .span {
        color: #000;
        font-family: Hiragino Mincho ProN;
        text-align: justify;
        text-align-last: justify;
        box-sizing: border-box;
    }

    .PriceTag .info .infoWarp .items .context {}


    .PriceTag .info .infoWarp .items .context .text {
        color: #000;
        font-family: Hiragino Mincho ProN;
        box-sizing: border-box;
    }

    .PriceTag .price {
        margin: 3px 0px 12px 0px;
        text-align: center;
        box-sizing: border-box;
    }

    .PriceTag .price .priceWarp {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-end;
        box-sizing: border-box;
    }

    .PriceTag .price .priceWarp .value {
        font-family: Hiragino Mincho ProN;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0em;
        text-align: center;
        zoom: 0.5;
        box-sizing: border-box;
    }

    .PriceTag .price .priceWarp .tax {
        font-family: Hiragino Mincho ProN;
        font-size: 10px;
        zoom: 0.6;
        font-weight: 700;
        letter-spacing: 0em;
        text-align: left;
        line-height: 5px;
        box-sizing: border-box;
    }

    .PriceTag .barCode {
        display: flex;
        justify-content: center;
        margin-bottom: 1px;
        box-sizing: border-box;
    }

    .PriceTag .barCode svg {
        height: 50px;
        box-sizing: border-box;
    }

    .PriceTag .footer {
        font-family: Hiragino Mincho ProN;
        font-size: 12px;
        line-height: 12px;
        font-weight: 200;
        letter-spacing: 0em;
        text-align: left;
        display: inline-flex;
        width: 100%;
        padding: 0px 8px;
        box-sizing: border-box;
        zoom: 0.5;
    }

    .PriceTag .footer .left {
        width: 10%;
        text-align: left;
    }

    .PriceTag .footer .right {
        width: 90%;
        text-align: right;
    }
    </style>
</head>

<body>
    <div class="print">
        <div id="printWarp">
            ${data}
        </div>
    </div>
</body>
</html>
`;
