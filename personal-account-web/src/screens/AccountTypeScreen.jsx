import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../styles/global';
import Year from '../components/Year';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import EntryDBHandler from '../databasehandler/entryhandler';
import UserDBHandler from '../databasehandler/userhandler';
import CategoryFilterModal from '../modals/CategoryFilterModal';
import LoadingSpinner from '../modals/LoadingSpinner';
import { formatLargeNumber, getSelectedCategories } from '../utils/converters';
import './AccountTypeScreen.css';

export default function AccountTypeScreen({ type = 'account' }) {
  const [years, setYears] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [countDoneLoading, setCountDoneLoading] = useState(0);
  const [edit, setEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("ALL");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const entryHandler = new EntryDBHandler();
  const categoryHandler = new CategoryDBHandler();
  const userHandler = new UserDBHandler();

  const getYears = (searchText = searchText, categories = categories) => {
    const categoryString = getSelectedCategories(categories).join(',');
    
    setEdit(false);
    setTotal(0);
    setIsLoading(true);
    setCountDoneLoading(0);
    
    entryHandler
      .getSearchYears(searchText, categoryString)
      .then((result) => {
        if (result.success) {
          setYears(result.message);
          setRefresh(false);
        } else {
          alert(`ERROR: ${result.message.toUpperCase()}`);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      })
      .catch((error) => {
        console.error('Error getting years:', error);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      });
  };

  const addToTotal = (amount) => {
    setTotal(prevTotal => prevTotal + amount);
  };

  const doneLoading = () => {
    setCountDoneLoading(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === years.length) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    categoryHandler
      .getCategories(type.toLowerCase())
      .then((result) => {
        if (!isMounted) return; // Don't update state if component unmounted
        
        if (result.success) {
          let tempCategories = [];
          result.message.forEach((category) => {
            tempCategories.push({
              category: category,
              status: true,
            });
          });
          
          setCategories(tempCategories);
          getYears('', tempCategories);
        } else {
          alert(`ERROR: ${result.message}`);
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Error getting categories:', error);
        setIsLoading(false);
      });

    userHandler.getAllUsers().then(result => {
      if (!isMounted) return;
      
      if (result.success) {
        result.message.push({ username: "ALL" });
        setUsers(result.message);
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [type]); // Only depend on type, which is correct

  const handleSearch = () => {
    setEdit(true);
    setTimeout(() => getYears(searchText), 10);
    console.log(`Searching: ${searchText}`);
  };

  const handleRefresh = () => {
    setEdit(true);
    setRefresh(true);
    getYears(searchText);
  };

  const saveCategories = (categories, user = "") => {
    setCategories(categories);
    setSelectedUser(user);
    setEdit(true);
    
    console.log("Selected user: " + user);
    setTimeout(getYears, 10);
  };

  const handleAddEntry = () => {
    navigate('/add-entry', {
      state: {
        type: type,
      }
    });
    setEdit(true);
  };

  return (
    <Container>
      <div className="account-type-screen">
        {/* Header with title and actions */}
        {/* <div className="screen-header"> */}
          {/* <h2>{type} Management</h2> */}
          
          
        {/* </div> */}

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search entries..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              // className="btn btn-secondary search-btn"
              onClick={handleSearch}
            >
              🔍
            </button>
            <button
              // className="btn btn-secondary"
              onClick={() => setShowCategoryModal(true)}
              title="Filter Categories"
            >
              ⧩
            </button>
            <button
              // className="btn btn-primary"
              onClick={handleAddEntry}
              title="Add Entry"
            >
              ➕ 
            </button>
          </div>
        </div>

        {/* Years List */}
        <div className="years-container">
          {years.length === 0 && !isLoading ? (
            <div className="no-data-message">
              <p>No data found for the selected criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="years-list">
              {years.map((year, index) => (
                <Year
                  key={year.year}
                  type={type}
                  year={year}
                  edit={edit}
                  categories={categories}
                  users={users}
                  selectedUser={selectedUser}
                  searchText={searchText}
                  passTotal={addToTotal}
                  doneLoading={doneLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category Filter Modal */}
        {showCategoryModal && (
          <CategoryFilterModal
            categories={categories}
            saveChanges={saveCategories}
            close={() => setShowCategoryModal(false)}
            users={users}
            selectedUser={selectedUser}
          />
        )}

        {/* Loading Spinner */}
        <LoadingSpinner isLoading={isLoading} />
      </div>
              {/* Total Footer */}
              
        <div className="total-footer">
          Total: $ {formatLargeNumber(total)}
        </div>
    </Container>
  );
}