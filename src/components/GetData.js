import { useRef, useEffect, useReducer, useState } from 'react';


// 画像を正方形のキャンバスの中央に "はみださないように" 配置する。
function prepCtx(img, size, ctx) {
  if (img.width > img.height) {
    const h = (size / img.width) * img.height;
    ctx.drawImage(img, 0, (size - h) / 2, size, h);
  } else {
    const w = (size / img.height) * img.width;
    ctx.drawImage(img, (size - w) / 2, 0, w, size);
  }
}


export default function Calc({ images, mode, dataDispatch, size }) {
  const canvasRef = useRef(null);
  const [hidden, setHidden] = useState(true);
  // 未処理の画像一覧入れ
  // stackDispatch() で先頭の画像を処理済み(削除)にする。
  // stackDispatch(images) で画像一覧を入れる。
  const [stack, stackDispatch] = useReducer((state, action) => {
    if (action === undefined) {
      return state.slice(1);
    } else {
      return action;
    }
  }, []);
  // 処理済みのデータ一覧入れ
  // dataDispatch() で内容を空にする。
  // dataDispatch(data) でデータを入れる。
  const [tempData, tempDataDispatch] = useReducer((state, d) => {
    if (d === undefined) {
      return [];
    }
    return [...state, d]
  }, []);


  // images に変更があったら
  useEffect(() => {
    // 画像がない(初期表示時とか)なら何もしない
    if (images.length === 0) {
      setHidden(true);
      return;
    }
    // 画像を stack に入れて、data を空にする
    stackDispatch(images);
    dataDispatch([]);
    setHidden(false);
    // eslint-disable-next-line
  }, [images]);


  // stack に変更があったら
  useEffect(() => {
    // stack が空なら
    if (stack.length === 0) {
      // 処理済みデータが空なら何もしない
      if (tempData.length === 0) return;
      // 処理済みデータを data に入れて、処理済みデータを空にする
      setHidden(true);
      dataDispatch(tempData);
      tempDataDispatch();
      return;
    }
    // 未処理(stack)があるなら処理する
    setHidden(false);
    canvasRef.current.width = size;
    canvasRef.current.height = size;
    const ctx = canvasRef.current.getContext('2d');
    const img = new Image();
    img.src = URL.createObjectURL(stack[0]);
    img.onload = () => {
      prepCtx(img, size, ctx);
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      const binData = [];
      for (let i = 0; i < data.length; i += 4) {
        switch (mode) {
          case "brightness":
            binData.push(data[i + 3] === 0 ? 255 : (data[i] + data[i + 1] + data[i + 2]) / 3);
            break;
          case "saturation": // calc saturation :  data[i] = r, data[i + 1] = g, data[i + 2] = b
            binData.push(data[i + 3] === 0 ? 255 : 255 * (Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])) / Math.max(data[i], data[i + 1], data[i + 2]));
            break;
          case "hue": // calc hue :  data[i] = r, data[i + 1] = g, data[i + 2] = b
            const max = Math.max(data[i], data[i + 1], data[i + 2]);
            const min = Math.min(data[i], data[i + 1], data[i + 2]);
            let h = 0;
            if (max === data[i]) {
              h = 60 * (data[i + 1] - data[i + 2]) / (max - min) + 0;
            } else if (max === data[i + 1]) {
              h = 60 * (data[i + 2] - data[i]) / (max - min) + 120;
            } else {
              h = 60 * (data[i] - data[i + 1]) / (max - min) + 240;
            }
            if (h < 0) h += 360;
            binData.push(data[i + 3] === 0 ? 255 : h);
            break;
          default:
            break;
        }
      }
      tempDataDispatch(binData.flatMap((_, i, binData) => i % size ? [] : [binData.slice(i, i + size)]));
      stackDispatch();
    };
    // eslint-disable-next-line
  }, [stack, mode]);

  return (
    <div>
      <canvas hidden={hidden} ref={canvasRef} style={{ border: "1px solid #aaa" }}></canvas>
    </div>
  );
}
