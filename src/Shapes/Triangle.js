const TriangleNode = ({ data }) => {
    return <div style={{ width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: '100px solid black' }}>{data.label}</div>;
  };