import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// 画像を表示してるだけ

export default function ImageViewer({ images }) {
  return (
    <Container fluid>
      <Row xs="auto">
        {images.length === 0 ? null : images.map((image, index) => (
          <Col key={`image-${index}`}>
          <Card style={{maxWidth: "200px"}}>
              <Card.Header className="p-1 sm">{image.name}</Card.Header>
              <Card.Body className="p-0">
                <Card.Text>
                  <Image
                    key={index}
                    src={URL.createObjectURL(image)}
                    fluid
                  />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}