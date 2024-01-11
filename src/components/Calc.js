import { useEffect } from 'react';

// 与えられたブロック(d)内にthreshold 未満の値があるかどうかをチェックする
// d は 1 次元配列。
// あれば 1、なければ 0 を返す。
function check(d, threshold) {
  let flag = 0;
  for (let i = 0; i < d.length; i++) {
    if (d[i] < threshold) {
      flag = 1;
      break;
    }
  }
  return flag;
}


// 最小二乗法で直線の傾きを求める
function lsm(d) {
  // d = [[x1, y1], [x2, y2], ...]
  const n = d.length;
  const sumX = d.reduce((acc, v) => acc + v[0], 0);
  const sumY = d.reduce((acc, v) => acc + v[1], 0);
  const sumXX = d.reduce((acc, v) => acc + v[0] * v[0], 0);
  const sumXY = d.reduce((acc, v) => acc + v[0] * v[1], 0);
  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return a;
}

// 1つの画像データ(data)のフラクタル次元を計算する。
// しきい値は threshold で、最大のブロックのサイズは size である。
// 分割数は 2^max, 2^(max-1), ..., 2^0 である。
function calcFD(data, max, size, threshold) {
  let output = [];
  for (let p = max; p >= 0; p--) {
    // 分割数
    let s = Math.floor(Math.pow(2, p));
    // 1ブロックのサイズ
    let w = Math.floor(size / s);
    // 「カウントされた」ブロックの数
    let count = 0;
    // 1ブロックずつチェックする
    for (let bx = 0; bx < s; bx++) {
      for (let by = 0; by < s; by++) {
        // 全体の2次元配列から対象ブロック部分を切り出して、1次元配列にしてチェックする
        count += check(
          data.slice(by * w, (by + 1) * w).map(d => d.slice(bx * w, (bx + 1) * w)).flat(),
          threshold
        )
      }
    }
    // 分割数とカウント数を対数にして記録する
    output.push([Math.log(w)/Math.log(2), Math.log(count)/Math.log(2)]);
  }
  return -lsm(output);
}



export default function Calc({ data, size, resultDispatch }) {
  // 画像サイズが 2の何乗かを計算する。
  // 例えばサイズが 512 なら、2^9 なので、2^9分割が最小分割数(1ブロックが 1x1)になる。
  // 次に小さい分割数は 2^8 (1ブロックが 2x2)。
  // こうすると割り切れないことがない。
  const max = Math.floor(Math.log(size) / Math.log(2));

  // dataに変更があったら
  useEffect(() => {
    // dataが空なら何もしない
    if (data.length === 0) return;
    resultDispatch();
    let result = [];
    // 各データを順に処理する(1画像につき1データある)
    data.forEach(d => {
      let xList = [];
      let yList = [];
      // しきい値を変化させつつ計算する
      for (let threshold = 16; threshold < 255; threshold += 16) {
        // しきい値を x 軸に、フラクタル次元を y 軸にする
        xList.push(threshold);
        yList.push(calcFD(d, max, size, threshold))
      }
      result.push([xList, yList]);
    });
    resultDispatch(result);
    // eslint-disable-next-line
  }, [data]);

  return (
    <div></div>
  )
}