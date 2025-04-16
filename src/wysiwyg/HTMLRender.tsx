import parse from 'html-react-parser';

function HTMLRender({ htmlString }: { htmlString : string}) {
  return <div>{parse(htmlString)}</div>;
}

export default HTMLRender;