import { StyleSheet, View } from "react-native";

const CommentSkeleton = () => {
    return (
        <View style={styles.commentContainer}>
            {/* Profile Pic */}
            <View style={styles.skelAvatar} />

            <View style={{ flex: 1 }}>
                {/* Username */}
                <View style={styles.skelUsername} />

                {/* Comment lines */}
                <View style={styles.skelLine} />
                <View style={[styles.skelLine, { width: "70%" }]} />

                {/* Meta row */}
                <View style={styles.skelMetaRow}>
                    <View style={styles.skelMeta} />
                    <View style={styles.skelMeta} />
                </View>
            </View>

            {/* Like */}
            <View style={styles.skelLike} />
        </View>
    );
};

export default CommentSkeleton;

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 10,
    },
    skelAvatar: {
        width: 35,
        height: 35,
        borderRadius: 50,
        backgroundColor: "#E1E1E1",
    },

    skelUsername: {
        width: 120,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#E1E1E1",
        marginBottom: 6,
    },

    skelLine: {
        width: "90%",
        height: 10,
        borderRadius: 6,
        backgroundColor: "#E1E1E1",
        marginBottom: 5,
    },

    skelMetaRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 6,
    },

    skelMeta: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#E1E1E1",
    },

    skelLike: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#E1E1E1",
    },

})