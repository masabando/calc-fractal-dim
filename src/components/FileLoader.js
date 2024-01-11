import { useRef } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import FormSelect from 'react-bootstrap/FormSelect';

// 計算ボタンを押すと画像を images に入れる。
// 計算モードを変更すると、value を mode に入れる。

export default function FileLoader({ className, imagesDispatch, resultDispatch, dataDispatch, modeDispatch }) {
  const inputRef = useRef(null);
  return (
    <div className={className} style={{ maxWidth: "500px" }}>
      <InputGroup className="mb-1">
        <FormControl
          type='file'
          multiple
          ref={inputRef}
        />
        <Button
          onClick={() => {
            dataDispatch([])
            resultDispatch([])
            imagesDispatch(Array.from(inputRef.current.files));
          }}
        >計算</Button>
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text>計算モード</InputGroup.Text>
        <FormSelect onChange={(e) => modeDispatch(e.target.value)}>
          <option value="brightness">明度</option>
          <option value="saturation">彩度</option>
          <option value="hue">色相</option>
        </FormSelect>
      </InputGroup>

    </div>
  );
}

