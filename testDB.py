from issueForm import add_record
import psycopg2


def test_add_record():
        issue_type = "Something"
        name = "test"
        email = "test@test.com"
        content = "Lorem ipsum khjdi khsaodie 8y-adsf"
        follow_up = True
        conn = psycopg2.connect("dbname=tpp-site-feedback user=zcrosby")
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM issue")
        (row_count,)= cur.fetchone()
        
        add_record(issue_type, name, email, content, follow_up)
        cur.execute("SELECT COUNT(*) FROM issue")
        (row_count_after,)= cur.fetchone()
        cur.close()
        conn.close()

        assert row_count_after == row_count + 1