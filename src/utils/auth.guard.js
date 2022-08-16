import { isAuthGuardActive } from '../constants/config'
import { setCurrentUser, getCurrentUser, getCurrentSubscriber } from '.'
export default (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {    
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        const roleArrayHierarchic = to.matched.filter(x => x.meta.roles).map(x => x.meta.roles);
        if (roleArrayHierarchic.every(x => x.includes(user.RolId-1))) {
          next();
        } else {
          next('/unauthorized')
        }
      } else {
        setCurrentUser(null);
        let sub = getCurrentSubscriber();
        if (sub != null && sub.id > 0) {
          next('/usuario/acceder');
        } else {
          next('/bienvenido');
        }
      }
    } else {
      next();
    }
  } else {
    if (to.path == "/usuario/acceder") {
      let sub = getCurrentSubscriber();
      if (sub == null) {
        next('/bienvenido');
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
