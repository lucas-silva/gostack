import React from 'react';
import PropTypes from 'prop-types';

function TechItem({ tech, handleDelete }) {
  return (
    <li>
      {tech}
      <button type="button" onClick={handleDelete}>Remover</button>
    </li>
  );
}

TechItem.defaultProps = {
  tech: 'Oculto'
};

TechItem.propTypes = {
  tech :PropTypes.string,
  handleDelete: PropTypes.func.isRequired,
}

export default TechItem;