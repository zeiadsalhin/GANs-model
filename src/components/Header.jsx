import { useState, useEffect } from 'react'; // import the app libraries
import { SwipeableDrawer, Button, Typography, Box } from '@mui/material'; // import the app libraries
import MenuIcon from '@mui/icons-material/Menu'; // import the app icons
import CloseIcon from '@mui/icons-material/Close'; // import the app icons
import { Link, useLocation } from 'react-router-dom'; // App navigation 

function Header() {
  // define states
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // watch for menu drawer
  useEffect(() => {
    setMobileMenuOpen(false); // Close the drawer dynamically when location changes
  }, [location]);

  // open menu function
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle swipe to close
  const handleDrawerClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <Box>
        <Box sx={{ maxWidth: 'xl', margin: '0 auto', paddingX: 1, paddingY: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 50, borderBottom: '1px solid gray' }}>
            {/* Mobile Menu Icon */}
            <Box sx={{ paddingBottom: '0.2rem' }}>
              <Button onClick={toggleMobileMenu} disableRipple sx={{ color: 'white' }}>
                <MenuIcon sx={{ fontSize: '2.5rem' }} />
              </Button>
            </Box>

            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '1rem' }}>
              SuperRes
            </Typography>
          </Box>

          {/* Mobile Menu (Drawer) */}
          <SwipeableDrawer
            anchor="left"
            open={isMobileMenuOpen}
            onClose={handleDrawerClose}  // Close when swiped or clicking outside
            onOpen={() => {}}  // You can define actions when opening if needed
            swipeAreaWidth={400} // Ensures swipeable area for the drawer
            sx={{
              '& .MuiDrawer-paper': {
                backgroundColor: '#171717',
                width: '66%',
                padding: 2,
              },
            }}
          >
            {/* Close Menu Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <img src="/logo.webp" className='invert w-[3rem] min-h-[3rem]' width='100%' height='100%' alt="logo" />
              <Button onClick={handleDrawerClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </Button>
            </Box>

            {/* Menu content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
              <Link to="/">
                <Button sx={{ color: 'white', marginBottom: 2 }}>Home</Button>
              </Link>

              <Link to="/AboutUs">
                <Button sx={{ color: 'white', marginBottom: 2 }}>About</Button>
              </Link>
            </Box>
          </SwipeableDrawer>
        </Box>
      </Box>
    </header>
  );
}

export default Header;
