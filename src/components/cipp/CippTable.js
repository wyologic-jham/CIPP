import React from 'react'
import ExportPDFButton from 'src/components/cipp/PdfButton'
import { CSpinner, CFormInput } from '@coreui/react'
import DataTable, { createTheme } from 'react-data-table-component'
import PropTypes from 'prop-types'

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <CFormInput
      style={{
        height: '32px',
        width: '200px',
      }}
      id="search"
      type="text"
      placeholder="Filter"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      className="d-flex justify-content-start"
    />
  </>
)

FilterComponent.propTypes = {
  filterText: PropTypes.string,
  onFilter: PropTypes.func,
  onClear: PropTypes.func,
}

export default function CippTable({
  data,
  isFetching = false,
  error,
  reportName,
  columns = [],
  tableProps: {
    keyField = 'id',
    theme = 'cyberdrain',
    pagination = true,
    responsive = true,
    dense = true,
    striped = true,
    subheader = true,
    expandableRows,
    expandableRowsComponent,
    expandableRowsHideExpander,
    expandOnRowClicked,
    selectableRows,
    onSelectedRowsChange,
    highlightOnHover = true,
    actions = [],
    ...rest
  } = {},
}) {
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const filteredItems = data.filter(
    (item) => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1,
  )

  createTheme(
    'cyberdrain',
    {
      text: {
        primary: 'var(--cipp-table-primary-colour)',
        secondary: 'var(--cipp-table-secondary-colour)',
      },
      background: {
        default: 'var(--cipp-table-bg)',
      },
      context: {
        background: 'var(--cipp-table-context-bg)',
        text: 'var(--cipp-table-context-color)',
      },
      divider: {
        default: 'var(--cipp-table-divider)',
      },
      button: {
        default: 'var(--cipp-table-button-bg)',
        hover: 'var(--cipp-table-button-hover-bg)',
        focus: 'var(--cipp-table-button-focus-bg)',
        disabled: 'var(--cipp-table-button-disabled-bg)',
      },
      sortFocus: {
        default: 'var(--cipp-table-sort-focus-bg)',
      },
      highlightOnHover: {
        default: 'var(--cipp-table-highlight-on-hover-bg)',
        text: 'var(--cipp-table-highlight-on-hover-color)',
      },
      striped: {
        default: 'var(--cipp-table-striped-bg)',
        text: 'var(--cipp-table-striped-color)',
      },
    },
    'default',
  )

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    const defaultActions = [
      <ExportPDFButton
        key="export-pdf-action"
        pdfData={data}
        pdfHeaders={columns}
        pdfSize="A4"
        reportName={reportName}
      />,
    ]

    actions.forEach((action) => {
      defaultActions.push(action)
    })
    return (
      <>
        <div className="w-50 p-3 d-flex justify-content-start">
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        </div>
        <div className="w-50 d-flex justify-content-end">{defaultActions}</div>
      </>
    )
  }, [filterText, resetPaginationToggle, columns, data, reportName, actions])

  return (
    <div>
      {isFetching && <CSpinner />}
      {!isFetching && error && <span>Error loading data</span>}
      {!isFetching && !error && (
        <div>
          <DataTable
            theme={theme}
            subHeader={subheader}
            selectableRows={selectableRows}
            onSelectedRowsChange={onSelectedRowsChange}
            subHeaderComponent={subHeaderComponentMemo}
            subHeaderAlign="left"
            paginationResetDefaultPage={resetPaginationToggle}
            //actions={actionsMemo}
            pagination={pagination}
            responsive={responsive}
            dense={dense}
            striped={striped}
            columns={columns}
            data={filteredItems}
            expandableRows={expandableRows}
            expandableRowsComponent={expandableRowsComponent}
            highlightOnHover={highlightOnHover}
            expandOnRowClicked={expandOnRowClicked}
            defaultSortAsc
            defaultSortFieldId={1}
            paginationPerPage={25}
            paginationRowsPerPageOptions={[25, 50, 100, 200, 500]}
            {...rest}
          />
        </div>
      )}
    </div>
  )
}

export const CippTablePropTypes = {
  reportName: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyField: PropTypes.string,
  tableProps: PropTypes.object,
  data: PropTypes.array,
  isFetching: PropTypes.bool,
  error: PropTypes.object,
}

CippTable.propTypes = CippTablePropTypes
