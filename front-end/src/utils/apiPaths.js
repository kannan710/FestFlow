export const API_PATHS = {
    AUTH: {
        LOGIN: '/api/auth/login', 
        REGISTER: '/api/auth/register',
        GET_USER: '/api/auth/getUser'
    },
    EVENT: {
        CREATE_EVENT: '/api/admin/create',
        GET_EVENTS: '/api/admin/events',
        GET_ALL_EVENTS: '/api/admin/all-events',
        GET_SINGLE_EVENT: (eventId) => `/api/admin/event/${eventId}`,
        EDIT_EVENT: (eventId) => `/api/admin/edit/${eventId}`,
        DELETE_EVENT: (eventId) => `/api/admin/delete/${eventId}`,
        REGISTER_EVENT: (eventId) => `/api/admin/event/${eventId}/register`,
        CANCEL_REGISTRATION: (eventId) => `/api/admin/event/${eventId}/cancel-registration`,
        GET_PARTICIPANTS: (eventId) => `/api/admin/event/${eventId}/participants`
    }
}
