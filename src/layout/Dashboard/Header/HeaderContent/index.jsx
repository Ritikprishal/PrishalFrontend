// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';

// project import
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// project import


// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>

      
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
