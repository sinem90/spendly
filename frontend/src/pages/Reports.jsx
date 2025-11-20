import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import PageHeader from '../components/PageHeader';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData] = await Promise.all([
        transactionService.getStats(dateRange.startDate, dateRange.endDate),
        transactionService.getTrends(6),
      ]);
      setStats(statsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!stats || !stats.byCategory) return;

    const headers = ['Category', 'Total Amount', 'Transaction Count', 'Percentage'];
    const total = stats.totalExpenses;
    const rows = stats.byCategory.map((cat) => [
      cat.category_name,
      `$${parseFloat(cat.total_amount).toFixed(2)}`,
      cat.transaction_count,
      `${((parseFloat(cat.total_amount) / total) * 100).toFixed(1)}%`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
      '',
      `Total Expenses,$${total.toFixed(2)}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spendly-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const setQuickRange = (months) => {
    setDateRange({
      startDate: format(subMonths(new Date(), months), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  // Format trends data for charts
  const formattedTrends = trends.map((t) => ({
    month: format(new Date(t.month), 'MMM yyyy'),
    expenses: parseFloat(t.total_expenses) || 0,
    income: parseFloat(t.total_income) || 0,
    net: (parseFloat(t.total_income) || 0) - (parseFloat(t.total_expenses) || 0),
  })).reverse();

  // Calculate insights
  const insights = stats
    ? {
        avgMonthlyExpenses:
          formattedTrends.length > 0
            ? formattedTrends.reduce((sum, t) => sum + t.expenses, 0) / formattedTrends.length
            : 0,
        avgMonthlyIncome:
          formattedTrends.length > 0
            ? formattedTrends.reduce((sum, t) => sum + t.income, 0) / formattedTrends.length
            : 0,
        totalIncome: formattedTrends.reduce((sum, t) => sum + t.income, 0),
        netSavings: formattedTrends.reduce((sum, t) => sum + t.net, 0),
        topCategory: stats.byCategory?.[0],
      }
    : null;

  // Colors for pie chart
  const COLORS = stats?.byCategory?.map((cat) => cat.color) || [];

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gray-600)' }}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <PageHeader
          title="Reports & Analytics"
          subtitle="Visualize your spending patterns and trends"
          action={
            <button
              onClick={exportToCSV}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              📥 Export to CSV
            </button>
          }
        />

      {/* Date Range Filters */}
      <div className="card fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Date Range</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setQuickRange(1)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--gray-100)',
                color: 'var(--gray-700)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Last Month
            </button>
            <button
              onClick={() => setQuickRange(3)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--gray-100)',
                color: 'var(--gray-700)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setQuickRange(6)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--gray-100)',
                color: 'var(--gray-700)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Last 6 Months
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {insights && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Expenses
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>
              ${stats.totalExpenses.toFixed(2)}
            </p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Income
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              ${insights.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Net Savings
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: insights.netSavings >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              ${insights.netSavings.toFixed(2)}
            </p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg Monthly Expenses
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              ${insights.avgMonthlyExpenses.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Monthly Trends Chart */}
      {formattedTrends.length > 0 && (
        <div className="card fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="month" stroke="var(--gray-600)" />
              <YAxis stroke="var(--gray-600)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="net" stroke="var(--primary)" strokeWidth={2} name="Net Savings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="card fade-in" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  dataKey="total_amount"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.category_name} (${((entry.total_amount / stats.totalExpenses) * 100).toFixed(0)}%)`}
                >
                  {stats.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${parseFloat(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card fade-in" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Category Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                <XAxis dataKey="category_name" stroke="var(--gray-600)" />
                <YAxis stroke="var(--gray-600)" />
                <Tooltip
                  formatter={(value) => `$${parseFloat(value).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar dataKey="total_amount" name="Total Spent">
                  {stats.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Category Table */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div className="card fade-in" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
            <h2 style={{ color: 'var(--gray-900)' }}>Category Details</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--gray-50)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Category
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Total Amount
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Transactions
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.byCategory.map((cat, index) => (
                <tr key={cat.category_id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: cat.color,
                        }}
                      />
                      <span style={{ color: 'var(--gray-900)', fontWeight: '500' }}>{cat.category_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--gray-900)', fontWeight: '600' }}>
                    ${parseFloat(cat.total_amount).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-600)' }}>
                    {cat.transaction_count}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--gray-700)' }}>
                    {((parseFloat(cat.total_amount) / stats.totalExpenses) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Data Message */}
      {stats?.byCategory?.length === 0 && (
        <div className="card fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
            No transactions found for the selected date range
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Reports;
