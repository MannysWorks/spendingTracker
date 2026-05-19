interface PaginationProps {
    entriesPerPage: number;
    totalEntries: number;
    setCurrentPage: (pageNumber: number) => void;
    currentPage: number;
}

const Pagination = ({
    entriesPerPage,
    totalEntries,
    setCurrentPage,
    currentPage,
}: PaginationProps) => {

    // Calculate total pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEntries / entriesPerPage); i++) {
        pageNumbers.push(i);
    }

    // Handle page change
    const paginate = (pageNumber: number, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage(pageNumber);
    };

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`page-item ${currentPage === number ? "active" : ""}`}
                    >
                        <a
                            onClick={(e) => paginate(number, e)}
                            href="!#"
                            className="page-link"
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
export default Pagination;