import { useEffect } from 'react';

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
  // 数えるべきブロック(threshold未満の値は1、それ以外は0に変換したもの)
  let d = data.map(l => l.map(c => c < threshold ? 1 : 0));
  for (let p = max; p >= 0; p--) {
    // 分割数
    let s = Math.floor(Math.pow(2, p));
    // カウント
    let count = d.flat().reduce((sum, ele) => sum + ele, 0);
    // 1ブロックのサイズ
    let w = Math.floor(size / s);
    // 分割数とカウント数を対数にして記録する
    output.push([Math.log(w) / Math.log(2), Math.log(count) / Math.log(2)]);
    if (p === 0) break;
    // dを更新(2x2のブロックを結合)
    let newD = new Array(s / 2).fill(0).map(() => new Array(s / 2).fill(0));
    let ix = 0, iy = 0;
    for (let y = 0; y < d.length; y += 2) {
      for (let x = 0; x < d.length; x += 2) {
        newD[iy][ix] = d[y][x] + d[y][x + 1] + d[y + 1][x] + d[y + 1][x + 1] > 0 ? 1 : 0;
        ix++;
      }
      ix = 0;
      iy++;
    }
    d = newD;
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