import React, { useCallback, useEffect, useState } from 'react';
import { MDBTooltip, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../Store';
import {useDebounce} from '../hooks/useDebouce'
import axios from 'axios'
import { toast } from 'react-toastify';
import { URL } from '../constants';

const BottomBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const debounceSearchTerm = useDebounce(searchTerm, 500)
  
  const router = useRouter();
  const { user, logout } = useUserStore()


  const handleSearch = useCallback(async (query) => {
    try {
      setIsSearching(true); 
      const { data } = await axios.get(`${URL}/search`, {
        params: { query }
      });
      console.log(data)
      setResults(data.data.products || []); 
    } catch (error) { 
      console.error("Search error:", error);
      setError(error.response?.data?.message || "Search failed");
      setResults([]);
    } finally {
      setIsSearching(false); 
    }
  }, []);
  
  useEffect(() => {
    if (debounceSearchTerm) {
      handleSearch(debounceSearchTerm); // Pass the search term here
    } else {
      setResults([]);
    }
  }, [debounceSearchTerm, handleSearch]); // Added handleSearch to dependencies


  const toggleDropdown = (key) => {
    setActiveDropdown(prev => (prev === key ? null : key));
    if (key !== 'search') setSearchTerm('');
  };

  const handleLogout=()=>{
    if(user?._id){
      logout()
      toast.success('Logout completed')
    }else{
      toast.warning('No User logged In')
    }
    
  }
  const tabData = [
    {
      key: 'menu',
      title: 'Menu',
      icon: 'fas fa-bars',
      links: [
        { name: 'Home', onPress: () => router.push('/') },
        { name: 'Privacy', onPress: () => router.push('/') },
        { name: 'Returns', onPress: () => router.push('/') },
        { name: 'Blogs', onPress: () => router.push('/') },

      ]
    },
    {
      key: 'account',
      title: 'Account',
      icon: 'fas fa-user',
      links: [
        { name: 'My Cart', onPress: () => router.push('/cart') },
        { name: 'Login', onPress: () => router.push('/login') },
        { name: 'My Orders', onPress: () => console.log('My Orders clicked') },
        { name: 'Settings', onPress: () => console.log('Settings clicked') },
        { name: 'Logout', onPress: () => handleLogout()},
      ]
    },
    {
      key: 'whatsapp',
      title: 'Chat',
      icon: 'fab fa-whatsapp',
      links: [
        { name: 'Call', onPress: () => console.log('Call') },
        { name: 'Chat', onPress: () => console.log('Chat') },
        { name: 'Email', onPress: () => console.log('Email') }
      ]
    },
    {
      key: 'search',
      title: 'Search',
      icon: 'fas fa-search',
      isSearch: true
    }
  ];

  return (
    <div className="position-fixed bottom-0 start-0 end-0 bg-white border-top d-flex justify-content-around p-2 shadow">
      {tabData.map(({ key, title, icon, links, isSearch }, idx) => {
          const isLast = idx === tabData.length - 1;
       return(
        <div key={key} className="position-relative text-center">
        <MDBTooltip
          tag="div"
          wrapperProps={{
            className: "d-flex align-items-center justify-content-center",
            onClick: () => toggleDropdown(key)
          }}
          title={title}
        >
          <MDBBtn color="dark" rounded className="shadow-0">
            <i className={icon}></i>
          </MDBBtn>
        </MDBTooltip>

        {activeDropdown === key && (
          <div
            className="position-absolute align-self-center bg-white border rounded shadow p-2"
            style={{
                bottom: '60px',
                minWidth: '200px',
                zIndex: 1000,
                left: isLast ? 'auto' : 0,
                right: isLast ? 0 : 'auto'
            }}
          >
            {isSearch ? (
              <>
                <MDBInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  size="sm"
                  autoFocus
                />
                {isSearching ? (
                  <div className="text-center py-2">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                ):(
                  results.length > 0 ? (
                    <div className="mt-2">
                      {results.map((product) => (
                        <div
                          key={product._id} 
                          className="dropdown-item d-flex align-items-center"
                          role="button"
                          onClick={() => {
                            router.push(`/product/${product.slug}`);
                            setActiveDropdown(null);
                          }}
                        >
                           <img 
                            src={product.image} 
                            alt={product.name} 
                            width="30" 
                            height="30" 
                            className="me-2"
                          /> 
                          {product.name} - {product.price}
                        </div>
                      ))}
                    </div>
                  ) : debounceSearchTerm && (
                    <div className="text-muted p-2">No results found</div>
                  )
                )}
              </>
            ) : (
              links.map(({ name, onPress }, idx) => (
                <div
                  key={idx}
                  className="dropdown-item"
                  role="button"
                  onClick={() => {
                    onPress();
                    setActiveDropdown(null);
                  }}
                >
                  {name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
    })}
    </div>
  );
};

export default BottomBar;
