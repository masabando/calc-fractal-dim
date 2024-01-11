import './App.scss'
import { useReducer } from 'react'
import Container from 'react-bootstrap/Container'
import MyNav from './components/MyNav'
import FileLoader from './components/FileLoader'
import ImageViewer from './components/ImageViewer'
import GetData from './components/GetData'
import Calc from './components/Calc'
import Graph from './components/Graph'

function App() {
  const size = 512
  // eslint-disable-next-line
  const [mode, modeDispatch] = useReducer((state, mode) => mode, 'brightness')
  const [images, imagesDispatch] = useReducer((state, fs) => fs, [])
  const [data, dataDispatch] = useReducer((state, data) => data, [])
  const [result, resultDispatch] = useReducer((state, data) => {
    if (data === undefined) return [];
    return data
  }, []);

  return (
    <div className="App">
      <MyNav />
      <Container fluid className="mb-5 pb-5">
        {/* ファイルロードするひと
        imagesに画像を入れる。modeにモードを入れる。resultとdataを空にする。 */}
        <FileLoader className="pt-4" imagesDispatch={imagesDispatch} resultDispatch={resultDispatch} dataDispatch={dataDispatch} modeDispatch={modeDispatch} />
        {/* 画像表示するひと */}
        <ImageViewer className="pt-4" images={images} />
        {/* 画像をデータに変換するひと
        dataを作成する。
        画像は縦横の最大サイズが size になるようにアスペクト比を保ってリサイズする。
        それを size x size のキャンバスの中央に配置して、それをもとにデータを作る。
        つまり、白で余白を足した正方形の画像からデータを作っていることになる。
        モード(明度とか)に沿ってデータを2次元配列(値は0〜255)にする */}
        <GetData images={images} mode={mode} dataDispatch={dataDispatch} size={size} />
        {/* 計算するひと
        resultを作成する。
        しきい値を変化させつつ全画像から次元を計算する。 */}
        <Calc data={data} size={size} resultDispatch={resultDispatch} />
        {/* グラフを表示するひと
        値の一覧も表示する。 */}
        <Graph result={result} images={images} />
      </Container>
    </div>
  );
}

export default App;
