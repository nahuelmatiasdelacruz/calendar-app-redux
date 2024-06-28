import { Calendar } from 'react-big-calendar';
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from '../components';
import { getMessagesES, localizer } from '../../helpers';
import { useState } from 'react';
import { useCalendarStore, useUiStore } from '../../hooks';

export const CalendarPage = () => {
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();
  const [lastView, setLastView] = useState(
    localStorage.getItem('lastView') || 'week'
  );
  const onDoubleClick = (e) => openDateModal();

  const onSelect = (e) => setActiveEvent(e);

  const onViewChange = (e) => {
    localStorage.setItem('lastView', e);
    setLastView(e);
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    };
    return { style };
  };
  return (
    <>
      <NavBar />
      <div>
        <Calendar
          culture="es"
          messages={getMessagesES()}
          localizer={localizer}
          events={events}
          defaultView={lastView}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 80px)' }}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CalendarEvent,
          }}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelect}
          onView={onViewChange}
        />
      </div>
      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  );
};
