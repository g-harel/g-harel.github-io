<?php include('header.php') ?>

<script>
    var info = {
        part1: 1,
        part2: 1,
        type: 1
    };

    $.post('../php_helper/find.php', info, function(events_response) {
        if(events_response.status == 'success') {
            document.write('<table>');
            console.log(events_response);
            for(var i = 0; i < events_response.counter; i++) {
                document.write('<tr>');
                document.write('<td>' + events_response[i].data1 + '</td>');
                document.write('<td>' + events_response[i].data2 + '</td>');
                document.write('<td>' + events_response[i].data3 + '</td>');
                document.write('</tr>');
            }
            document.write('</table>');
        }
    }, 'json');
</script>

<?php include('footer.php') ?>
