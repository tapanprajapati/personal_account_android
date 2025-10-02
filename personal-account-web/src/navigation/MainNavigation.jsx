import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import HomeTabNavigation from './HomeTabNavigation';
import AddEntry from '../screens/DataEntry/AddScreen';
import UpdateEntry from '../screens/DataEntry/UpdateScreen';
import AccountType from '../screens/AccountTypeScreen';
import Difference from '../screens/DifferenceScreen/DifferenceScreen';
import EntryList from '../screens/EntryListScreen';
import RecentEntries from '../screens/RecentEntries';
import ManageCategoriesScreen from '../screens/CategoryFunctions/ManageCategoriesScreen';
import ConfigScreen from '../screens/Config/ConfigScreen';
import ReportScreen from '../screens/Report/ReportScreen';
import YearsGraphScreen from '../screens/Graphs/YearsGraphScreen';
import MonthsGraphScreen from '../screens/Graphs/MonthsGraphScreen';
import { getMonthName } from '../utils/converters';

// Wrapper component to handle URL params for AccountTypeScreen
function AccountTypeWrapper() {
  const { type } = useParams();
  return <AccountType type={type} />;
}

export default function MainNavigation() {
  return (
    <div className="main-navigation">
      <Routes>
        <Route path="/" element={<HomeTabNavigation />} />
        <Route path="/add-entry" element={<AddEntry />} />
        <Route path="/update-entry/:id" element={<UpdateEntry />} />
        <Route path="/account-type/:type" element={<AccountTypeWrapper />} />
        <Route path="/difference" element={<Difference />} />
        <Route path="/entry-list/:type/:year/:month" element={<EntryList />} />
        <Route path="/recent-entries" element={<RecentEntries />} />
        <Route path="/manage-categories" element={<ManageCategoriesScreen />} />
        <Route path="/config" element={<ConfigScreen />} />
        <Route path="/report" element={<ReportScreen />} />
        <Route path="/graphs" element={<YearsGraphScreen />} />
        <Route path="/graphs/:year" element={<MonthsGraphScreen />} />
      </Routes>
    </div>
  );
}
