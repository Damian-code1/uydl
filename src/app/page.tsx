"use client";

import React, { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('levels');

  return (
    <main className="admin-page admin-shell">
      <div className="admin-topbar">
        <h1>Uruguay Demon List - Admin</h1>
        <div className="admin-top-actions">
          <button className="button button--primary" onClick={() => window.location.reload()}>
            Refresh Data
          </button>
        </div>
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

      <div className={`tab-panel ${activeTab === 'levels' ? 'active' : ''}`}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>
                  Cargando niveles desde la base de datos...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={`tab-panel ${activeTab === 'add' ? 'active' : ''}`}>
        <div className="panel-head">
          <h2>Add New Demon</h2>
        </div>
        <form className="admin-form admin-form--grid">
          <label>
            Level Name
            <input type="text" placeholder="e.g. Tartarus" />
          </label>
          <label>
            Creator
            <input type="text" placeholder="e.g. Riot" />
          </label>
          <label>
            Placement (Rank)
            <input type="number" placeholder="1" />
          </label>
          <label className="full">
            Video URL
            <input type="text" placeholder="https://youtube.com/..." />
          </label>
          <div className="form-actions full">
            <button type="button" className="button button--primary">Save Level</button>
          </div>
        </form>
      </div>
    </main>
  );
}