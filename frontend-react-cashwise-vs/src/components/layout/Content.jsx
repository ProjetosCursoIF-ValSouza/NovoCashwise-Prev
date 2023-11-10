import PropTypes from 'prop-types'; // Certifique-se de ter o pacote 'prop-types' instalado

import "./Content.css";

const Content = ({ children }) => {
  return (
    <div id="content">
      {children}
    </div>
  );
};

Content.propTypes = {
  children: PropTypes.node.isRequired
};

export default Content;
