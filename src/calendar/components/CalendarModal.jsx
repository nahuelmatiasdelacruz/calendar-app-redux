import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { customModalStyles } from '../../helpers';
import { useCalendarStore, useUiStore } from '../../hooks';
registerLocale('es', es);

Modal.setAppElement('#root');

export const CalendarModal = () => {
  const {isDateModalOpen,closeDateModal} = useUiStore();
  const { activeEvent, startSavingEvent } = useCalendarStore();
  const [isFormSubmitted,setIsFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 2),
  });
  const titleClass = useMemo(()=>{
    if(!isFormSubmitted) return '';
    return (formValues.title.length > 0) ? 'is-valid' : '';
  },[formValues.title,isFormSubmitted]);
  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  const onDateChange = (e, changing) => {
    setFormValues({
      ...formValues,
      [changing]: e,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    const difference = differenceInSeconds(formValues.end,formValues.start);
    if(isNaN(difference) || difference <= 0) {
      Swal.fire('Fechas incorrectas','Revisar la fechas ingresadas','error');
      return;
    }
    if(formValues.title.length <= 0) return;
    await startSavingEvent(formValues);
    closeDateModal();
    setIsFormSubmitted(false);
  }
  const onCloseModal = () => {
    closeDateModal();
  }
  useEffect(()=>{
    if(activeEvent !== null) {
      setFormValues({...activeEvent});
    };
  },[activeEvent]);
  return (
    <Modal
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customModalStyles}
      contentLabel="Example Modal">
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          <DatePicker
            locale='es'
            timeCaption='Hora'
            selected={formValues.start}
            onChange={(e) => onDateChange(e, 'start')}
            className="form-control ms-4"
            dateFormat="Pp"
            showTimeSelect
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            locale='es'
            timeCaption='Hora'
            minDate={formValues.start}
            selected={formValues.end}
            onChange={(e) => onDateChange(e, 'end')}
            className="form-control ms-4"
            dateFormat="Pp"
            showTimeSelect
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            onChange={onInputChange}
            type="text"
            value={formValues.title}
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            onChange={onInputChange}
            value={formValues.notes}
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button onClick={onSubmit} type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
