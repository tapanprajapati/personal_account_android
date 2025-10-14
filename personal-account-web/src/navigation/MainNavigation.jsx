import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import DashboardScreen from '../screens/DashboardScreen';
import AddEntry from '../screens/DataEntry/AddScreen';
import UpdateEntry from '../screens/DataEntry/UpdateScreen';
import AccountType from '../screens/AccountTypeScreen';
import Difference from '../screens/DifferenceScreen/DifferenceScreen';
import EntryList from '../screens/EntryListScreen';
import RecentEntries from '../screens/RecentEntries';
import ManageCategoriesScreen from '../screens/CategoryFunctions/ManageCategoriesScreen';
import ConfigScreen from '../screens/Config/ConfigScreen';
import ReportScreen from '../screens/Report/ReportScreen';

// Layout component that includes the header
function Layout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function MainNavigation() {
  return (
    <div className="main-navigation">
      <Routes>
        {/* Dashboard route */}
        <Route path="/" element={
          <Layout>
            <DashboardScreen />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <DashboardScreen />
          </Layout>
        } />
        
        {/* Account Type routes */}
        <Route path="/accountType/expense" element={
          <Layout>
            <AccountType type="Expense" />
          </Layout>
        } />
        <Route path="/accountType/income" element={
          <Layout>
            <AccountType type="Income" />
          </Layout>
        } />
        
        {/* Difference route */}
        <Route path="/difference" element={
          <Layout>
            <Difference />
          </Layout>
        } />
        
        {/* Data Entry routes */}
        <Route path="/add-entry" element={
          <Layout>
            <AddEntry />
          </Layout>
        } />
        <Route path="/update-entry" element={
          <Layout>
            <UpdateEntry />
          </Layout>
        } />
        
        {/* Other routes */}
        <Route path="/entry-list/" element={
          <Layout>
            <EntryList />
          </Layout>
        } />
        <Route path="/recent-entries" element={
          <Layout>
            <RecentEntries />
          </Layout>
        } />
        <Route path="/manage-categories" element={
          <Layout>
            <ManageCategoriesScreen />
          </Layout>
        } />
        <Route path="/config" element={
          <Layout>
            <ConfigScreen />
          </Layout>
        } />
        <Route path="/report" element={
          <Layout>
            <ReportScreen />
          </Layout>
        } />
      </Routes>
    </div>
  );
}
