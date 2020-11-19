import React, {useState, useEffect} from 'react';

import './Styles.scss';

const SelectionBox = (props) => {
	const {handleUserChange, id} = props;
	const [isChecked, setIsChecked] = useState(false);

	const toggleChecked = () => {
		setIsChecked(!isChecked);
	}

	useEffect(() => {
		handleUserChange(id, isChecked);
	}, [isChecked])

  return(
    <div
      className={"selectionBox " + (isChecked ? "selectionBox-selected" : "")}
			id={"selectionBox" + props.id}
			onClick={toggleChecked}
    >
      <img className="selectionBox--image" alt={props.answer.imageAlt} src={props.answer.image} />
      <input className="selectionBox--checkbox" type="checkbox" checked={isChecked} onChange={toggleChecked} />
      <span className="selectionBox--text">{props.answer.text}</span>
    </div>
   )
}

export default SelectionBox;
