from issueForm import add_record
import psycopg2


def test_add_record():
        url = "profiles"
        issue = "Something"
        name = "test"
        email = "test@test.com"
        content = "Lorem ipsum khjdi khsaodie 8y-adsf"
        follow_up = "yes"
        send_copy = "yes"
        user_agent =  "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/33.0.1750.152 Safari/537.36"

        conn = psycopg2.connect("dbname=tpp-site-feedback user=zcrosby")
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM issue")
        (row_count,)= cur.fetchone()
        
        add_record(url, issue, name, email, content, follow_up, send_copy, user_agent)
        cur.execute("SELECT COUNT(*) FROM issue")
        (row_count_after,)= cur.fetchone()
        cur.close()
        conn.close()

        assert row_count_after == row_count + 1
