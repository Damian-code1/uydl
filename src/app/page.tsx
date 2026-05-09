"use client";

import React, { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('levels');

  return (
    <main className="admin-page admin-shell">
      <div className="admin-topbar">
        <h1>Uruguay Demon List - Admin</h1>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'levels' ? 'active' : ''}`}
          onClick={() => setActiveTab('levels')}
        >
          Manage Levels
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add New Level
        </button>
      </div>

      {activeTab === 'levels' ? (
        <div className="tab-panel active">
          <div className="panel-head">
            <h2>Current Levels</h2>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Creator</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                    Conectando con la base de datos...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="tab-panel active">
          <div className="panel-head">
            <h2>Add New Demon</h2>
          </div>
          <form className="admin-form">
            <label>
              Level Name
              <input type="text" />
            </label>
            <button type="button" className="button button--primary" style={{ marginTop: '10px' }}>
              Save
            </button>
          </form>
        </div>
      )}
    </main>
  );
}